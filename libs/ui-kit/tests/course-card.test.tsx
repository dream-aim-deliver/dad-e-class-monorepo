// ...existing code...
describe('CourseCard', () => {
  // ...existing tests...
  
  it('logs an error if required props are missing for student user type', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(<CourseCard userType="student" />);
    
    expect(consoleSpy).toHaveBeenCalledWith('Course data is missing');
    consoleSpy.mockRestore();
  });
  // ...existing code...
});
