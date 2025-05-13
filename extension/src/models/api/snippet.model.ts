export interface ISnippet {
   name: string;
   description: string;
   trigger: string;
   codeSnippet: string;
   language: string;
}

export interface UserSnippetsDto {
   snippets: ISnippet[];
   snippetsVersion: number;
}
