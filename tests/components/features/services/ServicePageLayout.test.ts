import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServicePageLayout from '~/components/features/services/ServicePageLayout.vue'

describe('ServicePageLayout', () => {
  it('should render title prop', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation for Turkish university entrance exams',
      },
    })

    expect(wrapper.text()).toContain('TR-YÖS Courses')
  })

  it('should render subtitle prop', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation for Turkish university entrance exams',
      },
    })

    expect(wrapper.text()).toContain(
      'Professional preparation for Turkish university entrance exams',
    )
  })

  it('should render sub-services slot content', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
      slots: {
        'sub-services': '<div class="test-slot">Test Sub-Service</div>',
      },
    })

    expect(wrapper.find('.test-slot').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Sub-Service')
  })

  it('should have container class for layout', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
    })

    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('should have grid layout for sub-services', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
      slots: {
        'sub-services': '<div>Sub-Service 1</div><div>Sub-Service 2</div>',
      },
    })

    const grid = wrapper.find('.grid')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('gap-6')
  })

  it('should have responsive grid columns', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
    })

    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('md:grid-cols-2')
    expect(grid.classes()).toContain('lg:grid-cols-3')
  })

  it('should render multiple sub-services in slot', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
      slots: {
        'sub-services': `
          <div class="sub-service">Basic Course</div>
          <div class="sub-service">Advanced Course</div>
          <div class="sub-service">Individual Tutoring</div>
        `,
      },
    })

    const subServices = wrapper.findAll('.sub-service')
    expect(subServices).toHaveLength(3)
    expect(wrapper.text()).toContain('Basic Course')
    expect(wrapper.text()).toContain('Advanced Course')
    expect(wrapper.text()).toContain('Individual Tutoring')
  })

  it('should work without subtitle', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
      },
    })

    expect(wrapper.text()).toContain('TR-YÖS Courses')
  })

  it('should have section padding class', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
    })

    expect(wrapper.find('.section-py').exists()).toBe(true)
  })

  it('should render empty slot gracefully', () => {
    const wrapper = mount(ServicePageLayout, {
      props: {
        title: 'TR-YÖS Courses',
        subtitle: 'Professional preparation',
      },
      slots: {
        'sub-services': '',
      },
    })

    expect(wrapper.find('.grid').exists()).toBe(true)
  })
})
