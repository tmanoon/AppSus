import { NotePreview  } from "../cmps/NotePreview.jsx"
import { noteService } from "../services/note.service.js"
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
export function NoteIndex() {
    return <div>note app</div>

}



export function CarIndex() {
    const [searchParams, setSearchParams] = useSearchParams()

    const [cars, setCars] = useState(null)
    const [filterBy, setFilterBy] = useState(carService.getFilterFromParams(searchParams))

    useEffect(() => {
        // Sanitize filterBy
        setSearchParams(filterBy)
        loadCars()
    }, [filterBy])

    function onSetFilter(fieldsToUpdate) {
        console.log('fieldsToUpdate', fieldsToUpdate)

        setFilterBy(prevFilter => ({ ...prevFilter, ...fieldsToUpdate }))
    }

    function loadCars() {
        carService.query(filterBy)
            .then((cars) => {
                setCars(cars)
            })
    }

    function onRemoveCar(carId) {
        carService.remove(carId)
            .then(() => {
                setCars((prevCars) => prevCars.filter(car => car.id !== carId))
                showSuccessMsg(`Car removed successfully (${carId})`)
            })
            .catch((err) => {
                console.log('Had issues removing car', err)
                showErrorMsg(`Could not remove (${carId})`)
            })
    }

    function onUpdateCar(carToUpdate) {
        carService.save(carToUpdate)
            .then((savedCar) => {
                setCars(prevCars => prevCars.map(car => car.id === savedCar.id ? savedCar : car))
                showSuccessMsg(`Car updated successfully (${carToUpdate.id})`)
            })
            .catch(err => {
                console.log('Had issues with updating car', err)
                showErrorMsg(`Could not update car (${carToUpdate.id})`)
            })
    }

    // console.log('cars from car index', cars)
    // console.log('selectedCar from car index', selectedCar)
    const { txt, minSpeed, desc } = filterBy
    if (!cars) return <div>loading...</div>
    return <section className="car-index">
        <CarFilter
            onSetFilter={onSetFilter}
            filterBy={{ txt, minSpeed }} />
            
        <CarFilterDesc
            onSetFilter={onSetFilter}
            filterBy={{ desc }} />

        <Link to="/car/edit"><button>Add a car</button></Link>
        {/* <DataTable cars={cars} onRemoveCar={onRemoveCar} /> */}
        <CarList
            cars={cars}
            onRemoveCar={onRemoveCar}
            onUpdateCar={onUpdateCar}
        />
    </section >
}