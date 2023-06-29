const breedsListResponse = {
    message: {
        boxer: [],
        cattledog: [],
        dalmatian: [],
        husky: [],
    },
};

const dogImagesResponse = {
    message: [
        "https://images.dog.ceo/breeds/cattledog-australian/IMG_1042.jpg ",
        "https://images.dog.ceo/breeds/cattledog-australian/IMG_5177.jpg",
    ],
};


//returns an object similar to what a fetch API call would return
//tests select dropdown to populate dog breed list, and API call to get dog images when search

export default async function mockFetch(url) {
    switch (url) {
        case "https://dog.ceo/api/breeds/list/all": {
            return {
                ok: true,
                status: 200,
                json: async () => breedsListResponse,
            };
        }
        case "https://dog.ceo/api/breed/husky/images" :
        case "https://dog.ceo/api/breed/cattledog/images": {
            return {
                ok: true,
                status: 200,
                json: async () => dogImagesResponse,
            };
        }
        default: {
            throw new Error(`Unhandled request: ${url}`);
        }
    }
}