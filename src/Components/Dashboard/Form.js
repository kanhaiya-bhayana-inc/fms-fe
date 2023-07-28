import React, { useState, useEffect } from 'react';
import styles from './Form.module.css'
import { Button, notification, Space } from 'antd';
import { isEmail } from 'validator';
import loadingImage from '../../images/loading.gif';
import downloadTemplateFile from '../../files/template_file.csv'
import downloadFixedLengthTemplateFile from '../../files/fixed_length_template_file.csv'

import { pathConfiguration, infoDescriptions } from '../../utility/StaticDetails';
import ProgressPage from './ProgressPage';
import Select from "react-select";
import {
    fetchDelimiterOptions,
    fetchFiledateOptions,
    fetchFiletypeOptions,
    fetchVendorOptions
} from '../APIs/DropdownOptions/api';

import { fetchAllFileRecords, insertFileRecord } from '../APIs/FileRecords/api';
import  {mapData, vendorDataFilter} from '../../mapper/dataMapper';
import { validateEmail } from './formValidation';






export default function Form() {
    const [api, contextHolder] = notification.useNotification();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [fileName, setFileName] = useState("");
    const [vendorName, setVendorName] = useState("");

    let sourcepath = pathConfiguration.sourcepathprefix + `${vendorName}/${fileName}` + pathConfiguration.sourcepathsufix;
    let destinationpath = pathConfiguration.destinationpathprefix + `${vendorName}/${fileName}`;

    const [FixedLength, setFixedLength] = useState(false);
    const [IsActive, setIsActive] = useState(true);
    const [delimiterData, setDelimiterData] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [filedateData, setfiledateData] = useState([]);
    const [filetypeData, setfiletypeData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [records, setRecords] = useState([]);
    const [filterRecordsData, setFilterRecordsData] = useState([]);
    const [filesListDisplay, setFilesListDisplay] = useState(false);
    

    const [selected, setSelected] = useState(null);

    const handleChangeSelectFile = (selectedOption) => {
        setSelected(selectedOption);
    };

    // --- Style for Slect list display---
    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isSelected ? "" : "",
            backgroundColor: state.isSelected ? "" : "",
            textAlign: "left"
        }),
        control: (defaultStyles) => ({
            ...defaultStyles,
            width: "408px",
            textAlign: "left"
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "" }),
    };

    // --- Display the success and error notification --- 
    const openNotificationWithIcon = (type, msg, des) => {
        api[type]({
            message: msg,
            description: des
        });
    };

    
    const handleDropdownChange = (e) => {
        const { name, value } = e.target;
        formData.set(name, value);
    };
    


    useEffect(() => {
        fetchDelimiterOptions()
            .then((data) => setDelimiterData(data))
            .catch((error) => console.error('error setting dropdown options:', error));

        fetchFiledateOptions()
            .then((data) => setfiledateData(data))
            .catch((error) => console.error('error setting dropdown options:', error));

        fetchVendorOptions()
            .then((data) => setVendorData(data))
            .catch((error) => console.error('error setting dropdown options:', error));

        fetchFiletypeOptions()
            .then((data) => setfiletypeData(data))
            .catch((error) => console.error('error setting dropdown options:', error));

        fetchAllFileRecords()
            .then((data) => setRecords(data))
            .catch((error) => console.error('error setting dropdown options:', error));

           
        }, [])

    // changing the list of file-select on the basis of vendor name...
    var vendorFiles =[];
    if (vendorName){
        var vID = vendorData.find(item => item.name === vendorName);
        vendorFiles = vendorDataFilter(records,vID.id);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var vID = vendorData.find(item => item.name === vendorName);
        formData.set('sourcepath', sourcepath);
        formData.set('destinationpath', destinationpath);
        formData.set('filename', fileName);
        formData.set('vendorname', vID.id);
        formData.set('fixedlength', FixedLength);
        formData.set('isactive', IsActive);
        let email = formData.get('emailid');
        setLoading(true);

        if (!validateEmail(email)) {
            setLoading(false);
            openNotificationWithIcon('error', 'try agian', 'Please enter a valid email.')
        }
        else {
            const res = insertFileRecord(formData);
            res.then((data) => {
                        if (data.error == false) {
                            setLoading(false);
                            
                            openNotificationWithIcon('success', 'File uploaded successfully', data.status)
                        }
                        else {
                            setLoading(false);
                            openNotificationWithIcon('error', 'Error uploading file', data.status)
                        }
                    }).catch((error)=>{
                        console.log('error: ',error);
                    })
        };
    }

    const selectListFile = (e) => {
        setInputValue(e);
        setFilesListDisplay(false);
    }

    const fileNamesAndIds = mapData(records);

    const VendorFileNamesAndIds = mapData(vendorFiles);

 
    return (
        <div>

            <div className={styles.editContainer}>
                <button className={"btn" + " " + styles.buttonBgColor} onClick={()=>setEditMode(true)} data-bs-toggle="tooltip" data-bs-placement="bottom" title={infoDescriptions.editinfodescription}>Edit <i className="bi bi-pencil"></i></button>
                {/* <EditInfoIcon description={infoDescriptions.editinfodescription} /> */}
            </div>
            <div className='container'>
                {contextHolder}
                {
                    loading ? <ProgressPage /> : <>
                        <form>

                            <div className='row p-3' style={{ position: 'relative' }}>
                                <div className='col-4 p-2'>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label htmlFor="exampleInputFileName" className={"p-2" + " " + styles.labelDark}>Filename</label>
                                        {!editMode ?
                                            <>
                                                <input type="text" required onChange={(e) => setFileName(e.target.value)} className="form-control" id="exampleInputFileName" placeholder="Enter file name..." />
                                            </>
                                            :
                                            <>
                                                <div className="m-auto">
                                                    <Select options={vendorName ? VendorFileNamesAndIds : fileNamesAndIds} value={selected} components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} onChange={handleChangeSelectFile} autoFocus={true} styles={customStyles} />
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>

                                <div className='col-4 p-2'>
                                    <div className={"form-group" + " " + styles.colDisplay}>

                                        <label className={"p-2" + " " + styles.labelDark}>FileDate</label>
                                        <br />
                                        <select required onChange={handleDropdownChange} name="filedate" className={"custom-select btn" + " " + styles.dropdownInput} >
                                            <option defaultValue>Select</option>

                                            {filedateData.map((data, i) => {
                                                return (
                                                    <option key={i} value={data.id}>{data.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className='col-4 p-2' >
                                    <div className={"form-group" + " " + styles.colDisplay}>

                                        <label className={"p-2" + " " + styles.labelDark}>Vendor Name</label>
                                        <br />
                                        <select required onChange={(e)=>{setVendorName(e.target.value);setSelected(null);}} value={vendorName} name="vendorname" className={"custom-select btn" + " " + styles.dropdownInput} >
                                            <option defaultValue value="">Select</option>

                                            {vendorData.map((data, i) => {
                                                return (
                                                    <option key={i} value={data.name}>{data.name}</option>
                                                )
                                            })}
                                        </select>


                                    </div>
                                </div>
                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay} >
                                        <label className={"p-2" + " " + styles.labelDark}>Source Path</label>
                                        <input type="text" readOnly value={sourcepath} className={styles.disableInput + " " + "form-control"} id="exampleInputSourcePath" placeholder="Enter source path..." />

                                    </div>

                                </div>
                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2" + " " + styles.labelDark}>Destination Path</label>
                                        <input type="text" readOnly value={destinationpath} style={{ "width": "350px" }} className={styles.disableInput + " " + "form-control"} id="exampleInputDestinationPath" placeholder="Enter destination path..." />
                                    </div>
                                </div>
                                <div className='col-4 p-2'>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2" + " " + styles.labelDark}>Allowed File</label>
                                        <br />
                                        <select required onChange={handleDropdownChange} name="fileType" className={"custom-select btn" + " " + styles.dropdownInput} >
                                            <option defaultValue>Select</option>

                                            {filetypeData.map((data, i) => {
                                                return (
                                                    <option key={i} value={data.id}>{data.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='row p-3'>
                                <div className='col-4 p-2'>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label htmlFor="exampleInputDbnotebook" className={"p-2" + " " + styles.labelDark}>DBNotebook</label>
                                        <input type="text" onChange={(e) => formData.set('dbnotebook', e.target.value)} className="form-control" id="exampleInputDbnotebook" placeholder="Enter dbnotebook name..." />
                                    </div>
                                </div>



                                <div className='col-4 p-2'>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2" + " " + styles.labelDark}>Insertion Mode</label>
                                        {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                                        <br />
                                        <select onChange={handleDropdownChange} name="insertionmode" className={"custom-select btn" + " " + styles.dropdownInput} >
                                            <option defaultValue>Select</option>
                                            <option value="Append">Append</option>
                                            <option value="Overwrite">Overwrite</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='col-4 p-2 '  >
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2" + " " + styles.labelDark}>Delimiter</label>
                                        <br />
                                        <select onChange={handleDropdownChange} name="delimiter" className={"custom-select btn" + " " + styles.dropdownInput} >
                                            <option defaultValue>Select</option>

                                            {delimiterData.map((data, i) => {
                                                return (
                                                    <option key={i} value={data.id}>{data.name} {data.description}</option>
                                                );
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <hr />
                            <div className='row p-3'>
                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2 form-check-label" + " " + styles.labelDark} htmlFor="flexCheckDefault">
                                            FixedLength
                                        </label>

                                        <input onChange={(e) => { setFixedLength(e.target.checked); }} checked={FixedLength} className={styles.checkBox + " " + styles.checkboxiconFixedlength} name="fixedlength" type="checkbox" />
                                    </div>
                                </div>
                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2" + " " + styles.labelDark}>Download template file</label><br /><a className={styles.downloadFileIcon + " " + styles.checkboxiconDownload} href={FixedLength ? downloadFixedLengthTemplateFile : downloadTemplateFile} download={FixedLength ? "Fixed length template file" : "Template file"} target='_blank' rel='noreferrer'><i className="bi bi-cloud-arrow-down-fill"></i></a>
                                    </div>

                                </div>
                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay}>

                                        <label htmlFor="exampleInputTemplateFile" className={"p-2" + " " + styles.labelDark}>Template File</label>
                                        <input onChange={(e) => formData.set('templatefile', e.target.files[0])} type="file" className={"form-control" + " " + styles.selectFileInput} id="exampleInputTemplateDownload" />
                                    </div>
                                </div>


                            </div>
                            <hr />
                            <div className='row p-3'>

                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label className={"p-2 form-check-label" + " " + styles.labelDark} htmlFor="flexCheckDefault">
                                            Is Active
                                        </label>
                                        <input onChange={(e) => { setIsActive(e.target.checked); }} checked={IsActive} disabled name="IsActive" className={styles.checkBox + " " + styles.checkboxiconIsactive} type="checkbox" />
                                    </div>

                                </div>
                                <div className={'col-4 p-2'}>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label htmlFor="exampleInputTemplateUpload" className={"p-2" + " " + styles.labelDark}>Sample File</label>
                                        <input onChange={(e) => formData.set('samplefile', e.target.files[0])} type="file" className={"form-control" + " " + styles.selectFileInput} id="exampleInputTemplateUpload" />
                                    </div>
                                </div>


                                <div className='col-4 p-2'>
                                    <div className={"form-group" + " " + styles.colDisplay}>
                                        <label htmlFor="exampleInputEmail" className={"p-2" + " " + styles.labelDark}>Email</label>
                                        <input onChange={(e) => formData.set('emailid', e.target.value)} type="email" style={{ "width": "300px" }} className="form-control" id="exampleInputEmail" placeholder="Enter email..." />
                                    </div>

                                </div>
                            </div>
                            <hr />
                            <div className='row p-3'>
                                <div className='col-4 p-2'>

                                </div>
                                <div className='col-4 p-2'>
                                    <button className={"btn" + " " + styles.buttonBgColor} onClick={handleSubmit}>{loading ? "Submitting..." : "Submit"}</button>
                                    &nbsp;&nbsp;
                                    <input type='reset' className={"btn" + " " + styles.buttonBgColor} />
                                </div>
                                <div className='col-4 p-2'>

                                </div>
                            </div>
                        </form>
                    </>
                }

            </div>
        </div>
    )
}