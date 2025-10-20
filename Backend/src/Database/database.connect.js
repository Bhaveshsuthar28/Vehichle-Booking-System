import mongoose from 'mongoose'

const ConnectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log('databases connect')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export {ConnectDB}