import {
   ProgressOptions,
   Progress,
   CancellationToken,
   UriHandler,
   Disposable,
   OutputChannel,
   WebviewViewProvider,
   TreeViewOptions,
   TreeView,
   WebviewOptions,
   ViewColumn,
   WebviewPanel,
   WebviewPanelOptions,
   TextEditor,
   StatusBarAlignment,
   StatusBarItem,
   Event,
   TextDocument,
} from 'vscode';

export interface IVSCodeWindow {
   /**
    * The currently active editor or `undefined`. The active editor is the one
    * that currently has focus or, when none has focus, the one that has changed
    * input most recently.
    */
   activeTextEditor: TextEditor | undefined;

   withProgress<R>(
      options: ProgressOptions,
      task: (
         progress: Progress<{ message?: string; increment?: number }>,
         token: CancellationToken
      ) => Thenable<R>
   ): Thenable<R>;

   registerUriHandler(handler: UriHandler): Disposable;

   showInformationMessage(
      message: string,
      ...items: string[]
   ): Thenable<string | undefined>;

   showWarningMessage(
      message: string,
      ...items: string[]
   ): Thenable<string | undefined>;

   showErrorMessage(
      message: string,
      ...items: string[]
   ): Thenable<string | undefined>;

   /**
    * Creates a new {@link OutputChannel output channel} with the given name and language id
    * If language id is not provided, then **Log** is used as default language id.
    *
    * You can access the visible or active output channel as a {@link TextDocument text document} from {@link window.visibleTextEditors visible editors} or {@link window.activeTextEditor active editor}
    * and use the language id to contribute language features like syntax coloring, code lens etc.,
    *
    * @param name Human-readable string which will be used to represent the channel in the UI.
    * @param languageId The identifier of the language associated with the channel.
    */
   createOutputChannel(name: string, languageId?: string): OutputChannel;

   /**
    * Register a new provider for webview views.
    *
    * @param viewId Unique id of the view. This should match the `id` from the
    *   `views` contribution in the package.json.
    * @param provider Provider for the webview views.
    *
    * @return Disposable that unregisters the provider.
    */

   registerWebviewViewProvider(
      viewId: string,
      provider: WebviewViewProvider,
      options?: {
         /**
          * Content settings for the webview created for this view.
          */
         readonly webviewOptions?: {
            /**
             * Controls if the webview element itself (iframe) is kept around even when the view
             * is no longer visible.
             *
             * Normally the webview's html context is created when the view becomes visible
             * and destroyed when it is hidden. Extensions that have complex state
             * or UI can set the `retainContextWhenHidden` to make the editor keep the webview
             * context around, even when the webview moves to a background tab. When a webview using
             * `retainContextWhenHidden` becomes hidden, its scripts and other dynamic content are suspended.
             * When the view becomes visible again, the context is automatically restored
             * in the exact same state it was in originally. You cannot send messages to a
             * hidden webview, even with `retainContextWhenHidden` enabled.
             *
             * `retainContextWhenHidden` has a high memory overhead and should only be used if
             * your view's context cannot be quickly saved and restored.
             */
            readonly retainContextWhenHidden?: boolean;
         };
      }
   ): Disposable;

   /**
    * Create a {@link TreeView} for the view contributed using the extension point `views`.
    * @param viewId Id of the view contributed using the extension point `views`.
    * @param options Options for creating the {@link TreeView}
    * @returns a {@link TreeView}.
    */
   createTreeView<T>(viewId: string, options: TreeViewOptions<T>): TreeView<T>;

   /**
    * Create and show a new webview panel.
    *
    * @param viewType Identifies the type of the webview panel.
    * @param title Title of the panel.
    * @param showOptions Where to show the webview in the editor. If preserveFocus is set, the new webview will not take focus.
    * @param options Settings for the new panel.
    *
    * @return New webview panel.
    */
   createWebviewPanel(
      viewType: string,
      title: string,
      showOptions:
         | ViewColumn
         | {
              readonly viewColumn: ViewColumn;
              readonly preserveFocus?: boolean;
           },
      options?: WebviewPanelOptions & WebviewOptions
   ): WebviewPanel;

   /**
    * Creates a status bar {@link StatusBarItem item}.
    *
    * @param id The identifier of the item. Must be unique within the extension.
    * @param alignment The alignment of the item.
    * @param priority The priority of the item. Higher values mean the item should be shown more to the left.
    * @return A new status bar item.
    */
   createStatusBarItem(
      id: string,
      alignment?: StatusBarAlignment,
      priority?: number
   ): StatusBarItem;

   /**
    * An {@link Event} which fires when the {@link window.activeTextEditor active editor}
    * has changed. *Note* that the event also fires when the active editor changes
    * to `undefined`.
    */
   onDidChangeActiveTextEditor: Event<TextEditor | undefined>;

   /**
    * Show the given document in a text editor. A {@link ViewColumn column} can be provided
    * to control where the editor is being shown. Might change the {@link window.activeTextEditor active editor}.
    *
    * @param document A text document to be shown.
    * @param column A view column in which the {@link TextEditor editor} should be shown. The default is the {@link ViewColumn.Active active}.
    * Columns that do not exist will be created as needed up to the maximum of {@linkcode ViewColumn.Nine}. Use {@linkcode ViewColumn.Beside}
    * to open the editor to the side of the currently active one.
    * @param preserveFocus When `true` the editor will not take focus.
    * @returns A promise that resolves to an {@link TextEditor editor}.
    */
   showTextDocument(
      document: TextDocument,
      column?: ViewColumn,
      preserveFocus?: boolean
   ): Thenable<TextEditor>;
}
