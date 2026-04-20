export type ExperienceCategory = {
    id: number;
    name: string;
};

export type ExperienceCountry = {
    code: string;
    name: string;
    img?: string | null;
    continent?: string | null;
};

export type ExperienceAuthor = {
    id: number;
    name: string;
    img?: string | null;
};

export type Experience = {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    experience_date: string;
    created_at: string;
    status: 'draft' | 'published' | 'rejected';
    latitude?: number | null;
    longitude?: number | null;
    user: ExperienceAuthor;
    categories: ExperienceCategory[];
    main_country: ExperienceCountry | null;
    ratings_up_count: number;
    ratings_down_count: number;
    user_rating_value?: -1 | 0 | 1 | null;
};

export type ExperienceAuthorDetail = {
    id: number;
    name: string;
    img?: string | null;
    created_at: string;
    posts_count: number;
    score: number;
};
