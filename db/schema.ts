export const employeeSchema = {
    title: 'Employee',
    type: 'object',
    properties: {
        _id: {type: 'string'},
        wallet: {type: 'string'},
        bloxicoMail: {type: 'string'},
        email: {type: 'string'},
        activity: {
            type: 'number',
            minimum: 0,
            exlusiveMaximum: 732,
        },
        updated: 'number'
    }
}