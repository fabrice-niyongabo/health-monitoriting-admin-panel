import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react'
import Axios from 'axios'
import { errorHandler, toastMessage } from 'src/helpers'
import { BACKEND_URL } from 'src/constants'
import { useDispatch, useSelector } from 'react-redux'
import { setShowFullPageLoader } from 'src/actions/app'
import PlaceHolder from 'src/components/placeholder'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'
import FullPageLoader from 'src/components/full-page-loader'
import Edit from './edit'

const initialState = {
  name: '',
  numberOfBeds: '',
  type: '',
}

const Users = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.app)
  const [editItem, setEditItem] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [state, setState] = useState(initialState)

  const [isLoading2, setIsLoading2] = useState(false)
  const [usersList, setUsersList] = useState([])

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (state.name.trim() === '' || state.numberOfBeds.trim() === '' || state.type.trim() === '') {
      toastMessage('error', 'All fields on the form are required')
    } else {
      dispatch(setShowFullPageLoader(true))
      Axios.post(BACKEND_URL + '/departments/', {
        ...state,
        token,
      })
        .then((res) => {
          dispatch(setShowFullPageLoader(false))
          setState(initialState)
          toastMessage('success', res.data.msg)
          setUsersList([...usersList, res.data.department])
        })
        .catch((error) => {
          errorHandler(error)
          dispatch(setShowFullPageLoader(false))
        })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    setIsLoading2(true)
    Axios.get(BACKEND_URL + '/departments/?token=' + token)
      .then((res) => {
        setTimeout(() => {
          setIsLoading2(false)
          setUsersList(res.data.departments)
        }, 1000)
      })
      .catch((error) => {
        setTimeout(() => {
          setIsLoading2(false)
          errorHandler(error)
        }, 1000)
      })
  }

  const handleDelete = (id) => {
    dispatch(setShowFullPageLoader(true))
    Axios.delete(BACKEND_URL + '/departments/' + id + '/?token=' + token)
      .then((res) => {
        setTimeout(() => {
          dispatch(setShowFullPageLoader(false))
          toastMessage('success', res.data.msg)
          fetchUsers()
        }, 1000)
      })
      .catch((error) => {
        setTimeout(() => {
          errorHandler(error)
          dispatch(setShowFullPageLoader(false))
        }, 1000)
      })
  }

  return (
    <>
      <CRow>
        <CCol md={9}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Departments</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading2 ? (
                <PlaceHolder />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Department Name</th>
                        <th>Number Of Beds</th>
                        <th>Add date</th>
                        <th>Department Type</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.numberOfBeds}</td>
                          <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td>{item.type}</td>
                          <td>
                            <span
                              className="text-primary"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setEditItem(item)
                                setShowEditModal(true)
                              }}
                            >
                              <CIcon icon={cilPen} />
                              Edit
                            </span>
                            &nbsp; &nbsp;
                            <span
                              className="text-danger"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                confirm('Do you want to delete this user?')
                                  ? handleDelete(item._id)
                                  : null
                              }
                            >
                              <CIcon icon={cilTrash} />
                              Delete
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <form onSubmit={handleSubmit}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Add New Department</strong>
              </CCardHeader>
              <CCardBody>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Department names"
                    name="name"
                    value={state.name}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Number Of Beds</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter number of beds"
                    required
                    name="numberOfBeds"
                    value={state.numberOfBeds}
                    onChange={changeHandler}
                  />
                </div>
                <div className="mb-3">
                  <label>Department Type</label>
                  <select
                    name="type"
                    value={state.type}
                    onChange={changeHandler}
                    required
                    className="form-control"
                  >
                    <option value="">Select type</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                  </select>
                </div>
              </CCardBody>
              <CCardFooter>
                <button type="submit" className="btn btn-primary">
                  Save department
                </button>
              </CCardFooter>
            </CCard>
          </form>
        </CCol>
      </CRow>
      <Edit
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editItem={editItem}
        fetchData={fetchUsers}
        token={token}
      />
      <FullPageLoader isLoading={isLoading} />
    </>
  )
}

export default Users