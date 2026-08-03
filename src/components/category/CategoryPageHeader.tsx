import React from 'react'

type CategoryPageHeaderProps = {
  title: string
  description?: string | null
}

export const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({ title, description }) => {
  return (
    <header className="category-header">
      <div className="category-header__top">
        <h1 className="category-header__title">{title}</h1>
        {description ? <p className="category-header__description">{description}</p> : null}
      </div>
      <div className="category-header__bar" aria-hidden="true">
        <span className="category-header__bar-segment category-header__bar-segment--solid" />
        <span className="category-header__bar-segment category-header__bar-segment--mid" />
        <span className="category-header__bar-segment category-header__bar-segment--light" />
      </div>
    </header>
  )
}
