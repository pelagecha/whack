import { useState, useCallback, useRef } from "react";
import "./FileUpload.css"; // Import a CSS file for styling

const FileUpload = ({
    onFileUpload,
}: {
    onFileUpload: (file: File) => void;
}) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                onFileUpload(file);
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
