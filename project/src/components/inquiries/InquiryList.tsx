import React, { useState } from 'react';
import { Mail, Phone, Calendar, MessageSquare, Check, X, Archive, AlertTriangle, Trash2 } from 'lucide-react';
import { ContactInquiry } from '../../types';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface InquiryListProps {
  inquiries: ContactInquiry[];
  onUpdateStatus: (inquiryId: string, status: ContactInquiry['status']) => void;
  onMarkAsSpam: (inquiryId: string) => void;
  onArchive: (inquiryId: string) => void;
  onDelete: (inquiryId: string) => void;
  loading?: boolean;
}

export const InquiryList: React.FC<InquiryListProps> = ({
  inquiries,
  onUpdateStatus,
  onMarkAsSpam,
  onArchive,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContactInquiry['status']) => {
    switch (status) {
      case 'responded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'spam': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ContactInquiry['status']) => {
    switch (status) {
      case 'responded': return <Check className="h-3 w-3" />;
      case 'pending': return <MessageSquare className="h-3 w-3" />;
      case 'spam': return <AlertTriangle className="h-3 w-3" />;
      case 'archived': return <Archive className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Inquiries
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, subject, or message..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="spam">Spam</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiry Cards */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {inquiry.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                    {getStatusIcon(inquiry.status)}
                    <span className="ml-1">{inquiry.status.toUpperCase()}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{inquiry.email}</span>
                  </div>
                  
                  {inquiry.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{inquiry.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(new Date(inquiry.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{inquiry.subject}</h4>
                
                <div className="text-gray-700">
                  {expandedInquiry === inquiry.id ? (
                    <div>
                      <p className="leading-relaxed">{inquiry.message}</p>
                      <button
                        onClick={() => setExpandedInquiry(null)}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        Show less
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="leading-relaxed line-clamp-3">{inquiry.message}</p>
                      {inquiry.message.length > 200 && (
                        <button
                          onClick={() => setExpandedInquiry(inquiry.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                        >
                          Show more
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Inquiry ID: {inquiry.id.slice(0, 8)}...
              </div>
              
              <div className="flex space-x-2">
                {inquiry.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdateStatus(inquiry.id, 'responded')}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Responded
                  </Button>
                )}
                
                {inquiry.status !== 'spam' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkAsSpam(inquiry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Mark Spam
                  </Button>
                )}
                
                {inquiry.status !== 'archived' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onArchive(inquiry.id)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(inquiry.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredInquiries.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No inquiries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};