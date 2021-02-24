function createStore(reducer){
    let callbacks = []
    let state = reducer(undefined, {});

    return {
        dispatch(action){
            const newState = reducer(state, action)
            if (newState !== state){
                state = newState
                for (const cb of callbacks) cb()
            }
        },
        subscribe(callback){
            callbacks.push(callback)
            return () => callbacks = callbacks.filter(c => c !== callback)
        },
        getState(){
            return state;
        }
    }
}
const cartReducer = (state={}, {type, id, amount=1}) => {
    if (type === 'ADD') {
        return {...state, [id]: amount + (state[id] || 0)}
    }
    if (type === 'DEL') {
        if ((state[id] - amount)>0){
            return {...state, [id]: (state[id] || 0) - amount}
        }
        return {...state, [id]: 0}
    }
    return state
}

function productPrice (selectOpt, col) {
    if (selectOpt==='Пиво') return 80*col;
    if (selectOpt==='Вино') return 300*col;
    if (selectOpt==='Водка') return 150*col;
    if (selectOpt==='Мартини') return 400*col;
}

const actionAdd = (id, amount=1) => ({type: 'ADD', id, amount})
const actionDel = (id, amount=1) => ({type: 'DEL', id, amount})

let store = createStore(cartReducer)

function butAddProd (){
    store.dispatch(actionAdd(document.getElementById('product').value, +parseInt(document.getElementById('kolvo').value)))
    store.subscribe(() => document.getElementById('resultTable').innerHTML = `${Object.entries(store.getState())
        .map(([id, count]) => `<tr><td>${id}</td><td>${count}</td><td>${productPrice (id, count)}</td></tr>`)
        .join('\n')}`)
    store.subscribe(() => document.getElementById('cartQuant').innerHTML = `${Object.entries(store.getState()).length}`)
}
function butDelProd () {
    store.dispatch(actionDel(document.getElementById('product').value, +parseInt(document.getElementById('kolvo').value)))
    store.subscribe(() => document.getElementById('resultTable').innerHTML = `${Object.entries(store.getState())
        .map(([id, count]) => `<tr><td>${id}</td><td>${count}</td><td>${productPrice (id, count)}</td></tr>`)
        .join('\n')}`)
    store.subscribe(() => document.getElementById('cartQuant').innerHTML = `${Object.entries(store.getState()).length}`)

}

