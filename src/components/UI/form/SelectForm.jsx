import { Select } from 'antd'
import React from 'react'

const SelectForm = ({ showSearch, options, setSelectData, mode=false, defaultValue=undefined ,disabled}) => {
    const onChange = (value) => {
        setSelectData(value)
    };
    console.log("options: ", options)
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <Select
            mode={mode ?"tags" : undefined}
            tokenSeparators={mode ? [','] : undefined}
            showSearch={showSearch}
            placeholder="Select"
            onChange={onChange}
            filterOption={filterOption}
            options={options}
            style={{ width: '100%' }}
            size='large'
            defaultValue={defaultValue}
            disabled={disabled}
        />
    )
}

export default SelectForm