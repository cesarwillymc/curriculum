import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "https://27afjrvoij.execute-api.us-east-2.amazonaws.com/prod/";

const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(''); // Clear any previous errors
      try {
        const response = await axios.get<T>(`${BASE_URL}${url}`, {
          headers: {
            "Authorization": "coursecloudcomputingfinalproject"
          }
        });
        console.log(response.data);
        setData(response.data || {} as T); // Ensure data is always of type T
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};


// Function to send form data (POST request)
const apiFormData = async (formData: { name: string; email: string; phone: string; messageTitle: string; message: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}sendemail`, formData, {
      headers: {
        "Authorization": "coursecloudcomputingfinalprojectupdate"
      }
    });
    console.log("Email sent successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export { useFetchData, apiFormData };