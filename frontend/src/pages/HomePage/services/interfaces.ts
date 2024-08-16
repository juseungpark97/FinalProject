// src/pages/HomePage/services/interfaces.ts

export interface Movie {
    id: number;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    tagList: string[];
    genre: string | null;
    castList: string[];
    director: string;
    rating: number;
    releaseYear: number;
}

export interface Profile {
    profileNo: number;
    profileImg: string;
    profileName: string;
}
