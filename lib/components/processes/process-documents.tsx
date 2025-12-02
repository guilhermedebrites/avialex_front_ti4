import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { FileText, Download, Eye, Upload, Trash2 } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"

interface ProcessDocumentsProps {
  processId: string
}

const documents = [
  {
    id: 1,
    name: "Bilhete Aéreo LA3090.pdf",
    type: "Comprovante",
    size: "245 KB",
    uploadDate: "15/01/2024",
    uploadedBy: "Dr. Carlos Mendes",
  },
  {
    id: 2,
    name: "Comprovante Hospedagem.pdf",
    type: "Despesa",
    size: "189 KB",
    uploadDate: "15/01/2024",
    uploadedBy: "Pedro Silva",
  },
  {
    id: 3,
    name: "Petição Inicial.docx",
    type: "Petição",
    size: "1.2 MB",
    uploadDate: "20/01/2024",
    uploadedBy: "Dr. Carlos Mendes",
  },
  {
    id: 4,
    name: "Resposta LATAM.pdf",
    type: "Correspondência",
    size: "567 KB",
    uploadDate: "18/01/2024",
    uploadedBy: "Sistema",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "Comprovante":
      return "bg-blue-100 text-blue-800"
    case "Despesa":
      return "bg-green-100 text-green-800"
    case "Petição":
      return "bg-purple-100 text-purple-800"
    case "Correspondência":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ProcessDocuments({ processId }: ProcessDocumentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Documentos</CardTitle>
        <Button size="sm" variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">{doc.name}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge className={getTypeColor(doc.type)}>{doc.type}</Badge>
                  <span>{doc.size}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {doc.uploadDate} • {doc.uploadedBy}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="ghost">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
