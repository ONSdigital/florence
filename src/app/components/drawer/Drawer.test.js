import React from 'react';
import Drawer from './Drawer';
import { shallow } from 'enzyme';

const defaultProps = {
    handleTransitionEnd: () => {}
};

describe("Correct classes are set by the props", () => {
    const component = shallow(
        <Drawer {...defaultProps}/>
    )

    it("doesn't set the 'animatable' and 'visible' when no props are given", () => {
        expect(component.hasClass('visible')).toEqual(false);
        expect(component.hasClass('animatable')).toEqual(false);
    });

    it("sets the 'animatable' class when isAnimatable = true", () => {
        expect(component.hasClass('animatable')).toEqual(false);
        component.setProps({
            isAnimatable: true
        });
        expect(component.hasClass('animatable')).toEqual(true);
    });
    
    it("removes the 'animatable' class when isAnimatable = false", () => {
        expect(component.hasClass('animatable')).toEqual(true);
        component.setProps({
            isAnimatable: false
        });
        expect(component.hasClass('animatable')).toEqual(false);
    });
    
    it("sets the 'visible' class when isVisible = true", () => {
        expect(component.hasClass('visible')).toEqual(false);
        component.setProps({
            isVisible: true
        });
        expect(component.hasClass('visible')).toEqual(true);
    });
    
    it("removes the 'visible' class when isVisible = false", () => {
        expect(component.hasClass('visible')).toEqual(true);
        component.setProps({
            isVisible: false
        });
        expect(component.hasClass('visible')).toEqual(false);
    });
});

test("Renders child components", () => {
    const props = {
        ...defaultProps,
        children: <h1 id="heading-1">Heading 1</h1>
    }
    const component = shallow(
        <Drawer {...props}/>
    )

    expect(component.find('#heading-1').exists()).toEqual(true);
});

test("Function is run at the end of the drawer being animated", () => {
    let functionHasRun = false;
    const props = {
        ...defaultProps,
        handleTransitionEnd: () => {
            functionHasRun = true;
        }
    }
    const component = shallow(
        <Drawer {...props}/>
    )

    expect(functionHasRun).toEqual(false);
    component.simulate('transitionEnd');
    expect(functionHasRun).toEqual(true);
});