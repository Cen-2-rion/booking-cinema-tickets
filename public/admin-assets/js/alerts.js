export function alertRequiredField(value, label) {
    if (!value.trim()) {
        alert(`Поле "${label}" обязательно для заполнения`);
        return false;
    }
    return true;
}

export function alertPositiveInteger(value, label) {
    const regex = /^[\d\s]+$/;
    if (!regex.test(value)) {
        alert(`${label} должно быть положительным целым числом`);
        return false;
    }
    return true;
}

export function alertMaxLimit(value, max, label) {
    if (Number(value) > max) {
        alert(`${label} не может превышать ${max}`);
        return false;
    }
    return true;
}

export function alertDuplicateName(name, existingNames, label) {
    if (existingNames.includes(name.trim())) {
        alert(`${label} с таким названием уже существует`);
        return false;
    }
    return true;
}

export function alertTextOnly(value, label) {
    const regex = /^[a-zа-яё][a-zа-яё\s-,]+$/i;
    if (!regex.test(value)) {
        alert(`${label} может содержать только буквы, пробелы и дефисы`);
        return false;
    }
    return true;
}
