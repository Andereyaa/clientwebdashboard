import * as types from '../actions'
import {initialState} from './index'
import {getPeriodsBetweenTwoDatesInclusive} from '../utils/dateHandling'

//STATE
// periods: {
//     periodsById: {},
//     periodIdsLoaded
//     periodIds: [],
//     selectedId: null
// }


const periodsReducer = (state = initialState.periods, action = {}) => {
    const {type, payload} = action;
    switch (type) {

        case types.LOGOUT:
            return initialState.periods;

        case types.SAVE_INSTITUTION: {
            const institutionPeriods = getPeriodsBetweenTwoDatesInclusive(payload.institution.creationDate, Date.now())
            const periodsById = institutionPeriods.reduce((periodsById, period) =>{
                const existingPeriod = state.periodsById[period.startDate.valueOf()]
                periodsById[period.startDate.valueOf()] = {...existingPeriod, ...period}
                return periodsById
            }, {})
            const periodIds = Object.keys(periodsById)
            const selectedId = state.selectedId ? state.selectedId : periodIds[periodIds.length - 1] 
            return {
                ...state,
                periodIds,
                periodsById,
                selectedId
            }
        }
        default:
            return state
    }
};

export default periodsReducer