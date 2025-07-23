// eslint-disable-next-line no-undef
const HASH_KEY = process.env.HASH_KEY;

export default {
    secret: `${HASH_KEY}`,
    expiresIn: "7d"
}
