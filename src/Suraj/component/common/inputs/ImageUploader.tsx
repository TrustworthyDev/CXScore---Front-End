import React, { useState, ChangeEvent, DragEvent } from "react";

interface ImageUploaderProps {
  containerClassName?: string;
  labelClassName?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  handleChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  containerClassName = "",
  labelClassName = "",
  imageClassName = "",
  placeholderClassName = "",
  handleChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file);
    handleChange(file);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    setSelectedImage(file);
    handleChange(file);
  };

  const handleRemoveClick = () => {
    setSelectedImage(null);
    handleChange(null);
  };

  return (
    <div
      className={`flex flex-col items-center border ${
        dragging ? "border-dashed border-blue-500" : ""
      } ${containerClassName}`}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label
        htmlFor="imageInput"
        className={`mb-4 cursor-pointer ${labelClassName}`}
      >
        {selectedImage ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className={`h-30 w-40 rounded object-cover ${imageClassName}`}
            />
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={handleRemoveClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div
            className={`h-30 flex w-40 items-center justify-center rounded ${placeholderClassName}`}
          >
            <span className="text-gray-500">
              {dragging ? "Drop the image here" : "Select or drag an image"}
            </span>
          </div>
        )}
      </label>
      <label htmlFor="imageInput" className="sr-only">
        Select an image
      </label>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUploader;
