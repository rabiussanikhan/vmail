export interface Email {
    id: number,
    from: string,
    subject: string,
    body: string,
    sentAt: string,
    archived: boolean,
    read: boolean
}

export interface ChangeEmailParamType {
    toggleRead?: boolean,
    toggleArchive?: boolean,
    save?: boolean,
    closeModal?: boolean,
    changeIndex?: number
}

export interface EmailActionCallback {
    (e:Email):void
}