// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// /**
//  * Uploads an image to the backend for cataract analysis
//  * @param {File} imageFile The image file to analyze
//  * @returns {Promise<Object>} The analysis result including prediction and heatmap
//  */
// export async function analyzeImage(imageFile) {
//     const formData = new FormData();
//     formData.append('file', imageFile);

//     try {
//         const response = await fetch(`${API_URL}/predict`, {
//             method: 'POST',
//             body: formData,
//         });

//         if (!response.ok) {
//             throw new Error(`Analysis failed: ${response.statusText}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('API Error:', error);
//         throw error;
//     }
// }

import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const analyzeImage = async (file, source) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", source);

    const response = await axios.post(
        `${API_BASE}/analyze`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};
