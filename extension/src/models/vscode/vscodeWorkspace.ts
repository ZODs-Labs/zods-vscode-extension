import {
   CancellationToken,
   ConfigurationChangeEvent,
   Disposable,
   FileSystem,
   FileSystemWatcher,
   TextDocument,
   Uri,
   WorkspaceConfiguration,
   WorkspaceFolder, // eslint-disable-next-line @typescript-eslint/no-unused-vars
   workspace,
} from 'vscode';

export interface IVSCodeWorkspace {
   rootPath: string | undefined;
   workspaceFolders: readonly WorkspaceFolder[] | undefined;

   /**
    * A {@link FileSystem file system} instance that allows to interact with local and remote
    * files, e.g. `vscode.workspace.fs.readDirectory(someUri)` allows to retrieve all entries
    * of a directory or `vscode.workspace.fs.stat(anotherUri)` returns the meta data for a
    * file.
    */
   fs: FileSystem;

   onDidChangeConfiguration: IVSCodeEvent<ConfigurationChangeEvent>;
   getConfiguration(section?: string, resource?: Uri): WorkspaceConfiguration;
   findFiles(
      include: GlobPattern,
      exclude?: GlobPattern,
      maxResults?: number,
      token?: CancellationToken
   ): Thenable<Uri[]>;

   /**
    * Opens a document. Will return early if this document is already open. Otherwise
    * the document is loaded and the {@link workspace.onDidOpenTextDocument didOpen}-event fires.
    *
    * The document is denoted by an {@link Uri}. Depending on the {@link Uri.scheme scheme} the
    * following rules apply:
    * * `file`-scheme: Open a file on disk (`openTextDocument(Uri.file(path))`). Will be rejected if the file
    * does not exist or cannot be loaded.
    * * `untitled`-scheme: Open a blank untitled file with associated path (`openTextDocument(Uri.file(path).with({ scheme: 'untitled' }))`).
    * The language will be derived from the file name.
    * * For all other schemes contributed {@link TextDocumentContentProvider text document content providers} and
    * {@link FileSystemProvider file system providers} are consulted.
    *
    * *Note* that the lifecycle of the returned document is owned by the editor and not by the extension. That means an
    * {@linkcode workspace.onDidCloseTextDocument onDidClose}-event can occur at any time after opening it.
    *
    * @param uri Identifies the resource to open.
    * @returns A promise that resolves to a {@link TextDocument document}.
    */
   openTextDocument(uri: Uri): Thenable<TextDocument>;

   /**
    * Creates a file system watcher that is notified on file events (create, change, delete)
    * depending on the parameters provided.
    *
    * By default, all opened {@link workspace.workspaceFolders workspace folders} will be watched
    * for file changes recursively.
    *
    * Additional paths can be added for file watching by providing a {@link RelativePattern} with
    * a `base` path to watch. If the `pattern` is complex (e.g. contains `**` or path segments),
    * the path will be watched recursively and otherwise will be watched non-recursively (i.e. only
    * changes to the first level of the path will be reported).
    *
    * *Note* that requests for recursive file watchers for a `base` path that is inside the opened
    * workspace are ignored given all opened {@link workspace.workspaceFolders workspace folders} are
    * watched for file changes recursively by default. Non-recursive file watchers however are always
    * supported, even inside the opened workspace because they allow to bypass the configured settings
    * for excludes (`files.watcherExclude`). If you need to watch in a location that is typically
    * excluded (for example `node_modules` or `.git` folder), then you can use a non-recursive watcher
    * in the workspace for this purpose.
    *
    * If possible, keep the use of recursive watchers to a minimum because recursive file watching
    * is quite resource intense.
    *
    * Providing a `string` as `globPattern` acts as convenience method for watching file events in
    * all opened workspace folders. It cannot be used to add more folders for file watching, nor will
    * it report any file events from folders that are not part of the opened workspace folders.
    *
    * Optionally, flags to ignore certain kinds of events can be provided.
    *
    * To stop listening to events the watcher must be disposed.
    *
    * *Note* that file events from recursive file watchers may be excluded based on user configuration.
    * The setting `files.watcherExclude` helps to reduce the overhead of file events from folders
    * that are known to produce many file changes at once (such as `node_modules` folders). As such,
    * it is highly recommended to watch with simple patterns that do not require recursive watchers
    * where the exclude settings are ignored and you have full control over the events.
    *
    * *Note* that symbolic links are not automatically followed for file watching unless the path to
    * watch itself is a symbolic link.
    *
    * *Note* that file changes for the path to be watched may not be delivered when the path itself
    * changes. For example, when watching a path `/Users/somename/Desktop` and the path itself is
    * being deleted, the watcher may not report an event and may not work anymore from that moment on.
    * The underlying behaviour depends on the path that is provided for watching:
    * * if the path is within any of the workspace folders, deletions are tracked and reported unless
    *   excluded via `files.watcherExclude` setting
    * * if the path is equal to any of the workspace folders, deletions are not tracked
    * * if the path is outside of any of the workspace folders, deletions are not tracked
    *
    * If you are interested in being notified when the watched path itself is being deleted, you have
    * to watch it's parent folder. Make sure to use a simple `pattern` (such as putting the name of the
    * folder) to not accidentally watch all sibling folders recursively.
    *
    * *Note* that the file paths that are reported for having changed may have a different path casing
    * compared to the actual casing on disk on case-insensitive platforms (typically macOS and Windows
    * but not Linux). We allow a user to open a workspace folder with any desired path casing and try
    * to preserve that. This means:
    * * if the path is within any of the workspace folders, the path will match the casing of the
    *   workspace folder up to that portion of the path and match the casing on disk for children
    * * if the path is outside of any of the workspace folders, the casing will match the case of the
    *   path that was provided for watching
    * In the same way, symbolic links are preserved, i.e. the file event will report the path of the
    * symbolic link as it was provided for watching and not the target.
    *
    * ### Examples
    *
    * The basic anatomy of a file watcher is as follows:
    *
    * ```ts
    * const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(<folder>, <pattern>));
    *
    * watcher.onDidChange(uri => { ... }); // listen to files being changed
    * watcher.onDidCreate(uri => { ... }); // listen to files/folders being created
    * watcher.onDidDelete(uri => { ... }); // listen to files/folders getting deleted
    *
    * watcher.dispose(); // dispose after usage
    * ```
    *
    * #### Workspace file watching
    *
    * If you only care about file events in a specific workspace folder:
    *
    * ```ts
    * vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], '**​/*.js'));
    * ```
    *
    * If you want to monitor file events across all opened workspace folders:
    *
    * ```ts
    * vscode.workspace.createFileSystemWatcher('**​/*.js');
    * ```
    *
    * *Note:* the array of workspace folders can be empty if no workspace is opened (empty window).
    *
    * #### Out of workspace file watching
    *
    * To watch a folder for changes to *.js files outside the workspace (non recursively), pass in a `Uri` to such
    * a folder:
    *
    * ```ts
    * vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(<path to folder outside workspace>), '*.js'));
    * ```
    *
    * And use a complex glob pattern to watch recursively:
    *
    * ```ts
    * vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(<path to folder outside workspace>), '**​/*.js'));
    * ```
    *
    * Here is an example for watching the active editor for file changes:
    *
    * ```ts
    * vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.window.activeTextEditor.document.uri, '*'));
    * ```
    *
    * @param globPattern A {@link GlobPattern glob pattern} that controls which file events the watcher should report.
    * @param ignoreCreateEvents Ignore when files have been created.
    * @param ignoreChangeEvents Ignore when files have been changed.
    * @param ignoreDeleteEvents Ignore when files have been deleted.
    * @returns A new file system watcher instance. Must be disposed when no longer needed.
    */
   createFileSystemWatcher(
      globPattern: GlobPattern,
      ignoreCreateEvents?: boolean,
      ignoreChangeEvents?: boolean,
      ignoreDeleteEvents?: boolean
   ): FileSystemWatcher;
}

export type IVSCodeEvent<T> = (
   listener: (e: T) => any,
   thisArgs?: any,
   disposables?: Disposable[]
) => Disposable;

export type GlobPattern = string | IVSCodeRelativePattern;

export interface IVSCodeRelativePattern {
   base: string;
   baseUri: Uri;
   pattern: string;
   new (base: WorkspaceFolder | string, pattern: string): any;
}
