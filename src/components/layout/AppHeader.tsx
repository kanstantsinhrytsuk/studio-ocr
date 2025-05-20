import { FileJson2 } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <FileJson2 className="h-7 w-7 text-primary mr-2" />
          <span className="text-2xl font-bold text-foreground">SchemaReader</span>
        </div>
      </div>
    </header>
  );
}
