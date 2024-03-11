
define([],
    function () {
        class ServicesUtils {
            constructor() {
                this.apiUrl = "http://localhost:3000";
            }

            async fetchServicesData(path_name) {
                try {
                    const response = await fetch(`${this.apiUrl}/${path_name}`, { mode: 'cors' });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('API Error:', error);
                    throw error;
                }
            }

            async postData(data, path_name) {
                try {
                    console.log(`${this.apiUrl}/${path_name}`);
                    console.log(JSON.stringify(data));
                    const response = await fetch(`${this.apiUrl}/${path_name}`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    console.log(`In post data ${response.status}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const responseData = await response.json();
                    return responseData;
                } catch (error) {
                    console.error('API Error:', error);
                    throw error;
                }
            }

            async updateServiceData(serviceId, data, path_name) {
                try {
                    // Implement your update logic here using the PUT or PATCH method.
                    // Example:
                    const response = await fetch(`${this.apiUrl}/${path_name}/${serviceId}`, {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const responseData = await response.json();
                    return { response: responseData, status: response.ok };
                } catch (error) {
                    console.error('API Error:', error);
                    throw error;
                }
            }

            async deleteServiceData(serviceId, path_name) {
                try {
                    // Implement your delete logic here using the DELETE method.
                    // Example:
                    const response = await fetch(`${this.apiUrl}/${path_name}/${serviceId}`, {
                        method: 'DELETE',
                        mode: 'cors',
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const responseData = await response.json();
                    return { response: responseData, status: response.ok };
                } catch (error) {
                    console.error('API Error:', error);
                    throw error;
                }
            }


        }

        // Usage        
        return new ServicesUtils();

    }

);
