import React, { useEffect, useState } from 'react';
import PaginatedTable from './paginatedTable';
import { createUser, deleteUser, getUsersList, updateUser } from '../../service/service';
import { toast } from 'react-toastify';

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
];

const formInitialValues = { name: '', email: '' };

const ReusableTableComponent = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [mode, setMode] = useState('new');
    const [editData, setEditData] = useState();
    const [formData, setFormData] = useState(formInitialValues);
    const [errors, setErrors] = useState(formInitialValues);


    useEffect(() => {
        handleUsersListAPI();
    }, [])

    const handleUsersListAPI = async () => {
        try {
            const result = await getUsersList();
            console.log(result.data);
            setData(result.data)

        } catch (error) {
            console.error(error);

        }
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEdit = (row) => {
        setEditData(row)
        setMode('edit');
        setFormData({ name: row.name, email: row.email })
        setErrors({ ...formInitialValues });
    };

    const handleDelete = async (id) => {
        setData(data.filter((item) => item.id !== id));
        await deleteUser(id);
        toast.success('User deleted successful', {
            autoClose: 2000,
        });
    };

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const validateForm = () => {
        const newErrors = { ...formInitialValues };
        let isValid = true;

        if (!formData.name) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("is form valid:-", validateForm());
        console.log("errors.name", errors, errors.name);

        if (!validateForm()) {
            // toast.error('Name and Email Required', {
            //     autoClose: 3000,
            // });
            return;
        }
        if (validateForm()) {
            console.log('Form Data:', formData);
            if (mode === 'new') {
                const body = {
                    id: data.length + 1,
                    name: formData.name,
                    email: formData.email
                }
                await createUser(body)
                setData([...data, body]);
                toast.success('User Created successful', {
                    autoClose: 2000,
                });
            } else {
                let newData = data;
                const newArray = newData.map((row) => {
                    if (row.id === editData.id) {
                        row.name = formData.name;
                        row.email = formData.email;
                    }
                    return row;
                })
                const body = {
                    id: editData.id,
                    name: formData.name,
                    email: formData.email
                }
                await updateUser(editData.id, body)

                setData(newArray)
                toast.success('User Updated successful', {
                    autoClose: 2000,
                });

            }
        }

        setEditData(null);
        setMode('new');
        setFormData({ ...formInitialValues });
        setErrors({ ...formInitialValues });
    };

    return (

        <div>
            <h1 style={{ textAlign: "center", margin: "10px" }}>User Dashboard</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="Enter your Name"
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            // type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="Enter your Email"

                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    <button type="submit" className="submit-button">{mode === 'new' ? "Add User" : "Update User"}</button>
                </form>
            </div>

            <div className='table-container'>
                <div className="table-title">
                    <p className='table-heading'><b>Users List</b></p>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />

                </div>
                <PaginatedTable data={filteredData} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
            </div>

        </div>
    );
};

export default ReusableTableComponent;
