import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportedFormats() {
  return (
    <Card className="mt-6 border-none">
      <CardHeader>
        <CardTitle className="text-lg">Supported Formats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">PDF</Badge>
            <Badge variant="secondary">DOC(X)</Badge>
            <Badge variant="secondary">PPT(X)</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">XLS(X)</Badge>
            <Badge variant="secondary">TXT</Badge>
            <Badge variant="secondary">MD</Badge>
            <Badge variant="secondary">JSON</Badge>
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            Max file size: 10MB. Max files: 5.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
