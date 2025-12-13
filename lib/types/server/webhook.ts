export interface EspoCRMLead {
    id: string
    name?: string
    firstName?: string
    lastName?: string
    accountName?: string
    status?: string
    source?: string
    emailAddress?: string
    phoneNumber?: string
    description?: string
    assignedUserId?: string
    assignedUserName?: string
    teamsIds?: string[]
    createdAt?: string
    [key: string]: unknown
}
