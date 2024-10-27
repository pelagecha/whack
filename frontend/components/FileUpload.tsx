import { useState, useCallback, useRef } from "react";
import "./FileUpload.css";

const FileUpload = ({
    onFileUpload,
    onUploadSuccess,
}: {
    onFileUpload: (file: File) => void;
    onUploadSuccess: () => void;
}) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await fetch(
                        "http://localhost:5000/upload",
                        {
                            method: "POST",
                            body: formData,
                        }
                    );

                    if (response.ok) {
                        const result = await response.json();
                        console.log("File uploaded successfully:", result);
                    } else {
                        console.error("File upload failed");
                    }
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            }
        }
    };

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onFileUpload(e.dataTransfer.files[0]);
            }
        },
        [onFileUpload]
    );

    const handleButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div
            className={`file-upload ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".csv"
                ref={inputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <button onClick={handleButtonClick}>Upload</button>
            <div className="drag-drop-text">
                {dragActive
                    ? "Drop your file here"
                    : "Drag & Drop your file or click to upload"}
            </div>
        </div>
    );
};

export default FileUpload;
