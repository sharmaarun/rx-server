import { IsNotEmpty } from "class-validator"
import { FileMIMEType } from "./mime-types"

/**
 * Media manager configuration
 */
export type MediaConfig = {
    /**
     * adapter plugin name 
     */
    adapter: string
    /**
     * Path to location where the files should be stored/uploaded
     */
    path?: string
    /**
     * Max file size allowed for upload in bytes
     */
    maxFileSize?: number
}

/**
 * Different size formats for the image file
 */
export type ImageFileFormatsType = {
    thumb: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
}

export enum MediaType {
    "image" = "image",
    "audio" = "audio",
    "video" = "video",
    "doc" = "doc",
    "3d" = "3d",
    "other" = "other"
}

export interface File<T = any> {
    /**
     * unique name (probably uuid as physical filename)
     */
    filename: string
    /**
     * complete url including the domain name
     */
    url?: string
    /**
     * inidicates media type
     */
    type: T extends T ? MediaType : T
    /**
     * original filename
    */
    originalname: string
    /**
     * Size in bytes
     */
    size: number
    /**
     * different image size formats
     */
    imageformats?: ImageFileFormatsType
    /**
     * media encoding
     */
    encoding?: string
    /**
     * `Content-type` for this file
     */
    mimetype?: FileMIMEType
    /**
     * file extension
     */
    extension?: string
    /**
     * destination directory in the fs
     */
    destination: string

    /**
     * full local path to this file
     */
    path: string
    /**
     * use it for hierarchy based structure
     */
    parent?: string | number
    /**
     * Indicates if this file represents a directory or a file in fs
     */
    isDir?: boolean
}

export class FileUploadDTO<T = any, B = any> implements Partial<File<T>> {
    constructor(opts: FileUploadDTO) {
        Object.assign(this, opts)
    }
    @IsNotEmpty({ message: `Shouldn't be empty` })
    filename!: string

    @IsNotEmpty({ message: `Shouldn't be empy` })
    type!: T extends T ? MediaType : T

    @IsNotEmpty({ message: `Shouldn't be empty` })
    destination!: string

    @IsNotEmpty({ message: `Shouldn't be empty` })
    path!: string

    @IsNotEmpty({ message: `Shouldn't be empty` })
    buffer!: B

    @IsNotEmpty({ message: `Shouldn't be empty` })
    stream!: any

    @IsNotEmpty({ message: `Shouldn't be empty` })
    fieldname!: string
    originalname!: string
    encoding!: string
    mimetype!: FileMIMEType
    size!: number
}