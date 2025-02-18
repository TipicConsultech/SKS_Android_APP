import { getToken } from './asyncStorage';
import { feeback_url, host } from './constants'
// import { getToken } from './util/asyncStorage'; // Adjust to actual file path

// import { deleteUserData, getToken } from './session'

export async function login(data) {
  return await postOrPutData(host + '/api/login', data)
}

export async function register(data) {
  return await postOrPutData(host + '/api/register', data)
}

/**
 * Posts data to a URL and returns the response as JSON.
 *
 * @param {string} url - The URL to post to.
 * @param {object} data - The data to post.
 * @returns {Promise<object>} A promise that resolves to the response data.
 */


export async function postFormData(url = '', data) {
  try {
    const token = await getToken();  // Assuming getToken() retrieves the authentication token
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',  // Keep the Accept header
        Authorization: `Bearer ${token}`,  // Pass the token as a Bearer token
      },
      body: data,  // Pass the FormData object directly as the body
    });
    if (!response.ok) {
      if (response.status === 401 && !url.includes('/login')) {
        // deleteUserData();  // Assuming this function logs out or clears user session
        window.location.replace('/');
      }
      if (response.status === 422) {
        const error = await response.json();
        if (error.message) {
          throw new Error(error.message);
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse;  // Parse and return the JSON response
  }  catch (error) {
    console.error('Error posting data:', error);
    throw error;  // Re-throw the error for handling in the calling function
  }
}
// export const host =http://localhost:8000;
// get const L =" {host}+/api/login';
// post http://localhost:8000/api/login,{email,password}
// put http://localhost:8000/login,{email,password}
// delete http://localhost:8000/login,{email,password}


// async function postOrPutData(url = '', data = {}, method = 'POST') {
//   try {
//     const token = await getToken();
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     })

//     // if (!response.ok) {
//     //   if (response.status === 401 && !url.includes('/login')) {
//     //     // handle unauthorized
//     //     deleteUserData()
//     //     window.location.replace('/')
//     //   }
//     //   if (response.status === 422) {
//     //     const error = await response.json()
//     //     if (error.message) {
//     //       throw new Error(error.message)
//     //     }
//     //   }
//     //   throw new Error(`HTTP error! status: ${response.status}`)
//     // }

//     return response.json()
//   } catch (error) {
//     console.error('Error posting data:', error)
//     throw error
//   }
// }
async function postOrPutData(url = '', data = {}, method = 'POST') {
  try {
    const token = await getToken();

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // Handle HTTP errors gracefully
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Handle non-JSON responses

      if (response.status === 401 && !url.includes('/login')) {
        console.warn('Unauthorized, redirecting...');
        deleteUserData();
        // window.location.replace('/');
        return; // Stop further execution after redirect
      }

      if (response.status === 422) {
        const errorMessage = errorData.message || 'Validation error';
        console.error('Validation Error:', errorMessage);
        throw new Error(errorMessage);
      }

      const statusText = response.statusText || 'Unknown Error';
      // throw new Error(`HTTP Error ${response.status}: ${statusText}`);
      throw new Error(`Invalid Credentials`);

    }

    return response.json(); // Return JSON data if no errors
  } catch (error) {
    console.error('Error in postOrPutData:', error.message);
    throw error; // Rethrow the error if needed for further handling
  }
}
// async function getOrDelete(url = '', method = 'GET') {
//   try {
//     const token = await getToken();
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         // Handle unauthorized and redirect to home page
//         window.location.replace('/');
//       }
//       if (response.status === 422) {
//         const error = await response.json();
//         if (error.message) {
//           console.warn('Validation error:', error.message); // Log instead of throwing
//           return null; // Optionally return null or handle as needed
//         }
//       }
//       console.warn(`HTTP error! status: ${response.status}`); // Log status error
//       return null; // Handle gracefully
//     }

//     return response.json();
//   } catch (error) {
//     console.error('Error fetching data:', error); // Log but don't throw
//     return null; // Handle error without interrupting the flow
//   }
// }


async function getOrDelete(url='', method = 'GET') {
  try {
    const token = await getToken();
    const response = await fetch(url,{
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        
        window.location.replace('/')
      }
      if (response.status === 422) {
        const error = await response.json()
        if (error.message) {
          throw new Error(error.message)
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error posting data:', error)
    throw error
  }
}

export async function logout() {
  return await postOrPutData(host + '/api/logout')
}

export async function post(api,data) {
  return await postOrPutData(host + api, data)
}


export async function put(api, data) {
  return await postOrPutData(host + api, data, 'PUT')
}



export async function getAPICall(api) {
  return await getOrDelete(host + api)
}

export async function deleteAPICall(api) {
  return await getOrDelete(host + api, 'DELETE')
}
