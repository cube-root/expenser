
import { entity } from 'simpler-state';

const initialState = entity({
    userDetails: undefined,
    // accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJlMzZhMWNiZDBiMjE2NjYxOTViZGIxZGZhMDFiNGNkYjAwNzg3OWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQWJoaWppdGggdiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaXFpYzQxMXRBN0JFU0xsWnJucWtVcW5WQ1BJa0ZndTA3S1B1aXpwUT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9leHBlbnNlci1iYWNmMSIsImF1ZCI6ImV4cGVuc2VyLWJhY2YxIiwiYXV0aF90aW1lIjoxNjM3ODI2NDQ1LCJ1c2VyX2lkIjoiQnBUMFFiSHoyT1dra3Vuc1dBdWs0Tm9NTGpmMiIsInN1YiI6IkJwVDBRYkh6Mk9Xa2t1bnNXQXVrNE5vTUxqZjIiLCJpYXQiOjE2Mzc4MjY0NDUsImV4cCI6MTYzNzgzMDA0NSwiZW1haWwiOiJhYmhpaml0aGFiYWJoaWppdGhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTIxNjYxODk4Mjc4MzM3ODk1NTgiXSwiZW1haWwiOlsiYWJoaWppdGhhYmFiaGlqaXRoQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.ebXcVCN2mB0g2kby7mTTDH7UkkgWPmkDYksn96tvvF7YFD-KFKU6ypLS2MccgkEGeMk66BZ9wFuMht7yMTxkpEVteUocrErySC1X3tIr-oK5US8t5BtwBISHg1Gx93FmAA1yYI-fWBZFKIJQbHbbVdoMd6ooqZTksZBCDZKWPKj3aMDnKCJXyOyI_BENSlFw7zA7CggR-tI8V-ZqOvnJ0qO3qyLjGvs7OaiNZbFMPEcj7zijsoE2EoNBsUqjpieu04-bPHgoShbSEuQnSykNqdbdg9VHooRvpD_zZ9dLowMzJ8rQtjQDaTfLSx3ry9nZ5D5F0jchmXd24jZm80Ot7A"
    accessToken: undefined

})


const useStore = () => initialState.use();
const setStore = (data: any) => initialState.set(data);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    setAccessToken: (token: any) => {
        initialState.set(oldValue => ({ ...oldValue, accessToken: token }))
    },
    setUserDetails: (details: any) => {
        initialState.set(oldValue => ({ ...oldValue, userDetails: details }))
    }
}
export {
    useStore, setStore
}