import * as z from "zod"

export const User = z.object({
    name: z
        .string()
        .min(2, { error: "Minimum 2 characters are required" }).trim(),
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            error: 'Contain at least one special character.',
        })
        .trim(),
})

export type formState = | {
    errors?:{
        name?:string[],
        email?:string[],
        password?:string[],
    }
    message?:string
}|undefined