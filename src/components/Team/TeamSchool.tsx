import React from 'react'
import styled from 'react-emotion'

interface TeamSchoolProps {
  grade: number
  school: string
}

const School = styled.p`
  margin: 0;
`

function formatGrade(grade: number): string {
  switch (grade) {
    case 9:
      return 'Freshman'
    case 10:
      return 'Sophomore'
    case 11:
      return 'Junior'
    case 12:
      return 'Senior'
    default:
      throw new Error('Unknown Grade: ' + grade)
  }
}

function formatSchool(school: string): string {
  return school.toLowerCase() !== 'homeschool' ? `${school} ` : ' Homeschooled '
}

export const TeamSchool = ({ grade, school }: TeamSchoolProps) => (
  <School>
    {formatSchool(school)}
    {formatGrade(grade)}
  </School>
)
