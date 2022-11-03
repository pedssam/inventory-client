import React from 'react'

const Wrapper = ( { 
    // values
    html,
    title,
    subtitle,
    children
} ) => {

    return (
        <div
            style={{
                marginTop: 120,
                marginLeft: 370,
                marginBottom: 70,
                marginRight: 80,
            }}
        >
            { 
                title &&
                <div>
                    <div className="auth-wrapper-title text-lg">
                        { title }
                    </div>
                    <div className="pt-3 text-sm text-muted w-100">
                        { subtitle }
                    </div>
                </div>
            }
            <div 
                className='mt-3 card-container'
            >
                { children }
            </div>
        </div>
    )
}

export default Wrapper