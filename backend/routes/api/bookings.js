const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { restoreUser, requireAuth } = require('../../utils/auth')
const moment = require('moment');
moment().format();

const { Booking, Spot, User } = require('../../db/models')
const bookingValidations = require('../../utils/validations/bookings');


router.get('/', restoreUser, asyncHandler(async(req,res) => {
    const bookings = await Booking.findAll({
        include: [Spot, User],
    });
    return res.json(bookings)
}))


router.post('/', bookingValidations.validateCreate, asyncHandler(async(req,res, next) => {
    const { spotId, startDate, endDate } = req.body

    const bookings = await Booking.findAll({
        where: { spotId: spotId }
    });

    const conflict = bookings.filter((booking) => (
        (Date.parse(startDate) <= Date.parse(booking.endDate)) &&
        (Date.parse(endDate) >= Date.parse(booking.startDate)))
        )

    if (conflict.length > 0) {

        const start = moment(conflict[0].startDate).format("MMM Do YY");
        const end = moment(conflict[0].endDate).format("MMM Do YY")
        const err = new Error('Booking failed');
        err.status = 401;
        err.title = 'Booking failed';
        err.errors = [`Sorry, we are booked during your selected dates. Please, select dates before ${start} or after ${end}.`];
        return next(err);
        // res.json({"errors": "Sorry, we are booked during your selected dates. Please, select another date."})
    }

        const newBooking = await Booking.create(req.body)
        return res.json(newBooking)

}))

router.put('/:id(\\d+)', restoreUser, bookingValidations.validateUpdate, asyncHandler(async(req,res, next) => {
    const { startDate, endDate } = req.body
    const {id} = req.params

    const editBooking = await Booking.findByPk(id, {
        include: Spot,
    })
    const bookings = await Booking.findAll({
        where: { spotId: editBooking.spotId }
    });

    if (bookings) {
        const editConflict = bookings.filter((booking) => (booking.id !== +id))

        const conflict = editConflict.filter((booking) => (
            (Date.parse(startDate) <= Date.parse(booking.endDate)) &&
            (Date.parse(endDate) >= Date.parse(booking.startDate)))
            )
            if (conflict.length > 0) {

                const start = moment(conflict[0].startDate).format("MMM Do YY");
                const end = moment(conflict[0].endDate).format("MMM Do YY")
                const err = new Error('Booking failed');
                err.status = 401;
                err.title = 'Booking failed';
                err.errors = [`Sorry, we are booked during your selected dates. Please, select dates before ${start} or after ${end}.`];
                return next(err);
            } else {
                await editBooking.update(req.body)
                return res.json(editBooking)

            }
    }
}))

router.delete('/:id(\\d+)', asyncHandler(async(req,res) => {
    const {id} = req.params;
    const deleteBooking = await Booking.findByPk(id)
    await deleteBooking.destroy()
    res.json(deleteBooking)
}))



module.exports = router;
