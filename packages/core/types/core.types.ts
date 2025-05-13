import { FileType } from '../enums';

export interface FileTreeItem {
   label: string;
   type: FileType;
   path: string;
   relativePath: string;
   children?: FileTreeItem[];
}
