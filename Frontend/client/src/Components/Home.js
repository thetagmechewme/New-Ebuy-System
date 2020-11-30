import React from 'react';
import Jumbotron from '../Layout/Cards/Jumbotron';
import NewArrivals from '../Layout/Home/NewArrivals';
import BestSellers from '../Layout/Home/BestSellers';
import CategoryList from '../Layout/Category/CategoryList';
import SubCategoryList from '../Layout/Subcategory/SubCategoryList';

const Home = () => {

    return(
        <>
            <div className='jumbotron text-primary h1 font-weight-bold text-center'>
                <Jumbotron text={['WELCOME TO EBUY', 'EXPLORE WITH US', 'GREAT DEALS & DISCOUNTS', 'ENJOY THE EXPERIENCE']} />
                {/*{ loading ? (<h4
                        className='text-danger'
                        style={{textAlign: 'center'}}>
                        <LoadingOutlined />  Loading...
                    </h4>) :
                    (<h4
                        style={{textAlign: 'center'}}>All Products
                    </h4>) }*/}
            </div>
            <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
                New Arrivals
            </h4>
            <NewArrivals />
            <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
                Best Seller
            </h4>
            <BestSellers />
            <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
                Categories
            </h4>
            <CategoryList />
            <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
                Sub Categories
            </h4>
            <SubCategoryList />
        </>
    );
};
export default Home;
