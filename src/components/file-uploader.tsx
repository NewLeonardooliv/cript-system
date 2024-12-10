import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  handleFileSelect: (file: File, type: 'key' | 'document') => void;
  label: string;
  className?: string;
  inputClassName?: string;
  filesTypeAccepted?: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  handleFileSelect,
  label,
  className = '',
  inputClassName = '',
  filesTypeAccepted,
}) => {
  const [fileName, setFileName] = useState<string>('');

  const acceptedFormats = filesTypeAccepted ? filesTypeAccepted.reduce(
    (acc, ext) => {
      acc[`application/${ext}-file`] = [`.${ext}`];
      return acc;
    },
    {} as Record<string, string[]>
  ) : undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFormats,
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        handleFileSelect(file, 'key');
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full border border-dashed hover:border-gray-400 border-gray-600 rounded-lg p-10 text-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition duration-300 cursor-pointer max-w-xl mx-auto ${className}`}
    >
      <input {...getInputProps()} className={`hidden ${inputClassName}`} />
      <div className="text-2xl mb-4">
        <i className="fa fa-upload text-4xl"></i>
      </div>
      {isDragActive ? (
        <p className="text-blue-400">Solte os arquivos aqui...</p>
      ) : (
        <>
          <p className="font-bold text-sm">{label}</p>
          {fileName ? (
            <p className="text-md text-green-500">{`Arquivo selecionado: ${fileName}`}</p>
          ) : (
            <p className="text-md">Arraste e solte arquivos aqui ou clique para selecionar</p>
          )}
        </>
      )}
    </div>
  );
};

export default FileUploader;
