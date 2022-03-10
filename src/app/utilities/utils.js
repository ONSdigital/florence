export function toggleInArray(array, value){
    const index = array.indexOf(value)
    if( index > -1){
        array.splice(index, 1);
    } else {
        array.push(value)
    }
    return array
}