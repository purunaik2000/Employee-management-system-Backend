function employeeValidation(data, id) {
    let {
        firstName,
        lastName,
        gender,
        address,
        phoneNumber,
        email,
        dateOfBirth,
        dateOfJoining,
        password,
        type,
        designation,
        salary,
        ...rest
    } = data;

    if (Object.keys(rest).length || (id && email)) return {
        status: false,
        message: 'Invalid input field'
    }

    if (firstName && !/^[A-Za-z][A-Za-z' ]{2,15}$/.test(firstName)) return {
        status: false,
        message: 'First name is only allowed to contain letters, spaces, and apostrophes'
    }

    if (lastName && !/^[A-Za-z][A-Za-z']{2,15}$/.test(lastName)) return {
        status: false,
        message: 'Last name is only allowed to contain letters, spaces, and apostrophes'
    }

    if (gender && (gender != 'Male') && (gender != 'Female')) return {
        status: false,
        message: 'Gender must be Male or Female'
    }

    if (address) {
        if (typeof (address) != 'object') return {
            status: false,
            message: 'Address is required'
        }

        let addressFields = ['city', 'street', 'state', 'zip', 'country'];

        for (let field of addressFields) {
            if (address[field]) address[field] = address[field].toString().trim();
            if (!address[field]) return {
                status: false,
                message: `${field} is required`
            }
        }

        if (!/^[A-Za-z0-9][A-Za-z0-9 '/,]{2,50}$/.test(address.street)) return {
            status: false,
            message: 'Invalid street'
        }

        if (!/^[A-Za-z]{3,15}$/.test(address.city)) return {
            status: false,
            message: 'Invalid city'
        }

        if (!/^[A-Za-z]{3,15}$/.test(address.state)) return {
            status: false,
            message: 'Invalid state'
        }

        if (!/^[A-Za-z]{3,15}$/.test(address.country)) return {
            status: false,
            message: 'Invalid country'
        }

        if ((isNaN(address.zip) || (address.zip.length != 6))) return {
            status: false,
            message: 'Invalid zip code'
        }
    } else {
        if (!id) return {
            status: false,
            message: 'Address is required'
        }
    }

    if (phoneNumber && ((isNaN(phoneNumber) || (phoneNumber.length != 10)))) return {
        status: false,
        message: 'phone number must contain digits only'
    }

    if (email && (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) return {
        status: false,
        message: 'Invalid email address'
    }

    if (dateOfBirth && isNaN(new Date(dateOfBirth))) return {
        status: false,
        message: 'Invalid date of birth'
    }

    if (dateOfJoining && isNaN(new Date(dateOfJoining))) return {
        status: false,
        message: 'Invalid date of joining'
    }

    if (password && (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&.])[A-Za-z\d@$!%#*?&.]{8,15}$/.test(password))) return {
        status: false,
        message: 'Password must contain minimum 8 and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    }

    if (type && (type != "admin") && (type != "employee") && (type != "intern")) return {
        status: false,
        message: 'Type must be admin, Employee or Intern'
    }

    if (designation) {
        let designations = ['Manager', 'HR', 'Project Manager', 'SDE1', 'SDE2', 'Intern'];

        let isValidDesignation = false;
        for (let d of designations) {
            if (designation == d) {
                isValidDesignation = true;
                break;
            }
        }

        if (!isValidDesignation) return {
            status: false,
            message: 'Invalid designation'
        }
    }

    if (salary && isNaN(salary)) return {
        status: false,
        message: 'Salary must be numeric'
    }

    return true;
}

module.exports = employeeValidation;