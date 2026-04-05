import { apiClient } from "./client";

interface SignatureResponse {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  public_id: string;
  signature: string;
}

export const uploadApi = {
  async getSignedParams(): Promise<SignatureResponse> {
    const response = await apiClient.get("/upload/signature");
    return response.data.data;
  },

  async uploadImage(file: File): Promise<string> {
    const params = await this.getSignedParams();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", params.apiKey);
    formData.append("timestamp", String(params.timestamp));
    formData.append("signature", params.signature);
    formData.append("folder", params.folder);
    formData.append("public_id", params.public_id);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Cloudinary upload failed.");
    }

    const data = await uploadResponse.json();
    return data.secure_url;
  },
};
