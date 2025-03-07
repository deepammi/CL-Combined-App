import React, { useState } from 'react';

type FileUploadBoxProps = {
    onFileUpload?: (file: File) => void;
    setSelectedFile?: (file: File) => void;
    selectedFile: any | null
};  

const FileUploadBox: React.FC<FileUploadBoxProps> = ({setSelectedFile, selectedFile, onFileUpload }) =>{
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (setSelectedFile) {
                setSelectedFile(file);
            }
            if (onFileUpload) {
                onFileUpload(file);
            }
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (setSelectedFile) {
                setSelectedFile(file);
            }
            if (onFileUpload) {
                onFileUpload(file);
            }
        }
    };

    return (
        <div
            className="border-2 min-w-[80%] border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer">
                <div className="flex flex-col items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 text-gray-400 mb-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5v-12m0 12l3.5-3.5m-3.5 3.5l-3.5-3.5m3.5-8.5c-3.315 0-6 2.686-6 6s2.685 6 6 6 6-2.686 6-6-2.685-6-6-6z"
                        />
                    </svg>
                    {selectedFile ? (
                        <p className="text-gray-700">{selectedFile.name}</p>
                    ) : (
                        <p className="text-gray-500">Drag and drop a file here, or click to select a file</p>
                    )}
                </div>
            </label>
        </div>
    );
}

export default FileUploadBox;