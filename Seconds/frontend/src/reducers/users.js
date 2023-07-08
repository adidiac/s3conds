const storeToLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

const takeFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('user'));
}

const removeFromLocalStorage = () => {
    localStorage.removeItem('user');
}

export const user = (state=null,action)=>{

    //verify if user is logged in
    if(state===null){
        state=takeFromLocalStorage();
    }
    if(action.type==='LOGIN'){
        state=action.data;
        storeToLocalStorage(state);
        return state;
    }
    if(action.type==='LOGOUT'){
        state=null;
        removeFromLocalStorage();
        return state;
    }
    return state;
}