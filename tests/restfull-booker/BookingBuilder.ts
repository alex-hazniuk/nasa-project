interface BookingDates {
    checkin: string,
    checkout: string
}

// add '?' to properties to keep them not initialized
interface Booking {
    firstname?: string,
    lastname?: string,
    totalprice?: number,
    depositpaid?: boolean,
    bookingdates?: BookingDates,
    additionalneeds?: string
}

export class BookingBuilder {
    private data: Booking;

    constructor() {
        this.data = {};
    }

    addFirstName(name: string) {
        this.data.firstname = name;
        return this;
    }

    addLastName(lastName: string) {
        this.data.lastname = lastName;
        return this;
    }

    addTotalPrice(totalPrice: number) {
        this.data.totalprice = totalPrice;
        return this;
    }

    addDepositPaid(depositPaid: boolean) {
        this.data.depositpaid = depositPaid;
        return this;
    }

    addBookingDates(dates: BookingDates) {
        this.data.bookingdates = dates;
        return this;
    }

    addAdditionalNeeds(needs: string) {
        this.data.additionalneeds = needs;
        return this;
    }

    build() {
        return this.data;
    }
}

const bookingBuilder = new BookingBuilder()
    .addFirstName('Alex')
    .addBookingDates({
        chekin: '2022',
        checkout: '2023'
    }).build();
console.log(bookingBuilder);