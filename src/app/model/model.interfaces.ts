import { HttpErrorResponse } from "@angular/common/http";

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    strSortField: string;
    strSortDirection: string;
    strFilter: string;
    strFilteredTitle: string;
    strFilteredMessage: string;
    nRecords: number;
}

export interface IEntity {
    id: number,
}

export interface IUser extends IEntity {
    name: string,
    surname: string,
    lastname: string,
    email: string,
    username: string,
    password: string,
    role: boolean,
    threads?: number,
    replies?: number,
    latitude: number,
    longitude: number,
    verified: boolean,
    token: string,
    active: boolean,
    profileImageUrl?: string
}

export interface IUserPage extends IPage<IUser> {
}

export interface IThread extends IEntity {
    title: string,
    user: IUser,
    replies?: number,
    active: boolean
}

export interface IThreadPage extends IPage<IThread> {
}

export interface IReply extends IEntity {
    active: boolean;
    reply: any;
    title: string,
    body: string,
    creation: Date,
    user: IUser,
    thread: IThread,
    ratings: number
}

export interface IReplyPage extends IPage<IReply> {
    active: boolean
}

export interface IReplyPage extends IPage<IReply> {

}

export type formOperation = 'EDIT' | 'NEW';

export interface SessionEvent {
    type: string;
}

export interface IToken {
    jti: string;
    iss: string;
    iat: number;
    exp: number;
    name: string;
}

export interface IRating {
    id: number;
    user: IUser;
    reply: IReply;
    stars: number;
    created_at: Date;
}

export interface IRatingPage extends IPage<IRating> {
    text: string,
    image: string
}

export interface IPrelogin extends IEntity {
    token: string,
    captchaImage: string
}

export class Language {
    constructor(
        public code: string,
        public name: string,
        public resource: string
    ) { }
}