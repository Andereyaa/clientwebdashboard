import React, {Component} from 'react'
import styles from './DataTable.module.css'
import DataTableRow from './DataTableRow'
import SortButton from '../SortButton'
import {SORT_DIRECTION_ASC, SORT_DIRECTION_DESC} from '../../constants/misc'
export default class DataTable extends Component {

    state ={
        sortBy: null,
        sortDirection: SORT_DIRECTION_ASC
    }

    static defaultProps = {
        errors: {},
        headings: {},
        fieldTransformFunctions: {},
    }
    
    sortData = dataArray => dataArray

    handleSortButtonPress = field => {
        const {sortBy, sortDirection} = this.state
        const newSortDirection = (sortBy !== field) ? 
                                SORT_DIRECTION_ASC
                                :
                                (sortDirection !== SORT_DIRECTION_ASC) ?
                                SORT_DIRECTION_ASC
                                :
                                SORT_DIRECTION_DESC

        const newSortBy = ((sortBy === field ) && 
                            (sortDirection === SORT_DIRECTION_DESC) &&
                            (newSortDirection === SORT_DIRECTION_ASC)) ? null : field
        this.setState({sortBy: newSortBy, sortDirection: newSortDirection})
    }

    getHeader = () => {
        const {headings, fields} = this.props
        const {sortBy, sortDirection} = this.state
        return (
        <div className={styles.headerContainer}>
            {
                fields.map(
                    field => <div key={`${field}header`} className={styles.th}>
                                {headings[field] ? headings[field] : field}
                                <SortButton
                                    isSorting={field === sortBy} 
                                    sortDirection={sortDirection}
                                    onClick={() => this.handleSortButtonPress(field)} 
                                />
                            </div>
                )
            }
        </div>
        )
    }

    getRows = (dataArray) => {
        const {errors, fields, fieldTransformFunctions} = this.props
        return dataArray.map((data, index) => {
            const error = errors[data.id]
            return <DataTableRow
                    key={data.id}
                    data={data}
                    fields={fields}
                    fieldTransformFunctions={fieldTransformFunctions}
                    even={((index % 2) > 0)}
                    error={error}
                />
        })
    }

    render (){
        const {dataArray} = this.props
        if (!dataArray) return null
        return (
            <div className={styles.container}>
                {this.getHeader()}
                <div className={styles.rowContainer}>
                {
                    dataArray.length > 0 ?
                    this.getRows(this.sortData(dataArray))
                    :
                    <div className={styles.noData}>No Data</div>
                }
                </div>
            </div>
        )
    }
}