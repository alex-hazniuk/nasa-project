export class BookingFactory {

    static createValidBooking() {
        return {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        };
    }

    static createValidBookings(count: number) {
        const arr: Array<any> = [];
        for(let i = 0; i < count; i++) {
            const booking = this.createValidBooking();
            arr.push(booking);
        }
        return arr;
    }

    static createBookingWithoutDates() {
        return {
            firstname: "Jim",
            lastname: "Brown",
            totalprice: 111,
            depositpaid: true,
            additionalneeds: "Breakfast"
        };
    }

    static createBookingWithInvalidData() {
        return {
            firstname: -1,
            lastname: true,
            totalprice: 0,
            depositpaid: true,
            bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01"
            },
            additionalneeds: "Breakfast"
        };
    }
}