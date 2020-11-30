import React from 'react';
import './style.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import {Avatar, Badge} from 'antd';

const FileUpload = ({values, setValues, setLoading}) => {
    const { user } = useSelector((state) => ({ ...state }));
    const FileUploadAndResize = (e) => {
        //console.log(e.target.files);
        //Resize image
        let files = e.target.files;
        let allUploads = values.images;
        if(files){
            setLoading(true);
            for( let i = 0; i < files.length; i++ ){
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    'JPEG',
                    100,
                    0,
                    (uri) => {
                        //console.log(uri);
                        axios.post(`${process.env.REACT_APP_API}/uploadimages`,
                            {image: uri},
                            {headers: {
                                authtoken: user ? user.token : '',
                                },
                            })
                            .then((res) => {
                                console.log('IMAGE UPLOAD RES DATA: ', res);
                                setLoading(false);
                                allUploads.push(res.data);
                                setValues({ ...values, images: allUploads });
                            })
                            .catch((err) => {
                                setLoading(false);
                                console.log('CLOUDINARY UPLOAD ERR: ', err);
                            });
                },
                    'base64'
                );
            }
        }
    };

    const handleImageRemove = (public_id) => {
        setLoading(true);
        console.log('Removed image ID: ', public_id);
        axios.post(`${process.env.REACT_APP_API}/removeimages`,
            {public_id},
            {headers: {
                    authtoken: user ? user.token : '',
                },
            })
            .then((res) => {
                setLoading(false);
                const { images } = values;
                let filteredImages = images.filter((item) => {
                    return item.public_id !== public_id;
                });
                setValues({ ...values, images: filteredImages });
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    return (
        <>
            <div className='row'>
                { values.images && values.images.map((image) => (
                    <Badge
                        count='X'
                        style={{ cursor: "pointer" }}
                        onClick={() => handleImageRemove(image.public_id)}
                        key={image.public_id}>
                        <Avatar
                            src={image.url}
                            size={100}
                            shape='square'
                            className="ml-3"
                        />
                    </Badge>
                )) }
            </div>
            <div className='row'>
                <label className='btn btn-primary btn-raised mt-3'>Choose File
                    <input
                        type='file'
                        multiple
                        hidden
                        accept='images/*'
                        onChange={FileUploadAndResize}
                    />
                </label>
            </div>
        </>
    );

};
export default FileUpload;
