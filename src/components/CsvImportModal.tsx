import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText } from 'lucide-react';

interface CsvImportModalProps {
  onImport: (file: File) => Promise<void>;
  importing: boolean;
}

const CsvImportModal: React.FC<CsvImportModalProps> = ({ onImport, importing }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      setSelectedFile(file);
    } else if (file) {
      alert('Please select a CSV file');
      event.target.value = '';
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      await onImport(selectedFile);
      setIsOpen(false);
      setSelectedFile(null);
      // Очищаем input
      const fileInput = document.getElementById('csv-file-input-modal') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const downloadExampleCsv = () => {
    const csvContent = `firstName,lastName,phoneNumber,segment,notes,status
Иван,Петров,+7 (999) 123-45-67,CSV,Клиент из импорта,new
Мария,Сидорова,+7 (999) 234-56-78,CSV,Потенциальный клиент,new
Алексей,Козлов,+7 (999) 345-67-89,CSV,Существующий клиент,conversation`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers_example.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Import Customers from CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Формат CSV */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-3">CSV Format</h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-600">Required fields:</span>
                  <ul className="mt-1 space-y-1 text-slate-600">
                    <li>• phoneNumber</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Optional fields:</span>
                  <ul className="mt-1 space-y-1 text-slate-600">
                    <li>• firstName</li>
                    <li>• lastName</li>
                    <li>• segment</li>
                    <li>• notes</li>
                    <li>• status</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Пример CSV */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-slate-900">Example CSV</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={downloadExampleCsv}
                className="text-blue-600 hover:text-blue-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Download Example
              </Button>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">
{`firstName,lastName,phoneNumber,segment,notes,status
Иван,Петров,+7 (999) 123-45-67,CSV,Клиент из импорта,new
Мария,Сидорова,+7 (999) 234-56-78,CSV,Потенциальный клиент,new
Алексей,Козлов,+7 (999) 345-67-89,CSV,Существующий клиент,conversation`}
              </pre>
            </div>
          </div>

          {/* Загрузка файла */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-3">Upload CSV File</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-2">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Drop your CSV file here or click to browse'}
              </p>
              <input
                id="csv-file-input-modal"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                variant="outline"
                onClick={() => document.getElementById('csv-file-input-modal')?.click()}
                className="mt-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import Customers'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CsvImportModal; 