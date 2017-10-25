import React from 'react';
import Card from './Card.jsx';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

const props = {
    title: "Card title"
}

test('Renders the title for the card', () => {
  const component = shallow(
      <Card {...props}/>
  )
  expect(component.find('.card__title').text()).toEqual(props.title);
});
